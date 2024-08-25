const connection = require("../Database/db");
const catchAsyncError = require("../Middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const bcrypt = require("bcryptjs");

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const {
    f_name,
    l_name,
    email,
    mobile,
    phone_code,
    password,
    device_type,
    player_id,
    user_type,
    login_type,
    social_id,
  } = req.body;

  try {
    if (!f_name) {
      return next(new ErrorHandler("Please send data", 500));
    }
    if (!l_name) {
      return next(new ErrorHandler("Please send data", 500));
    }
    if (!email) {
      return next(new ErrorHandler("Please send data", 500));
    }
    if (!mobile) {
      return next(new ErrorHandler("Please send data", 500));
    }
    if (!device_type) {
      return next(new ErrorHandler("Please send data", 500));
    }
    if (!player_id) {
      return next(new ErrorHandler("Please send data", 500));
    }
    if (!user_type) {
      return next(new ErrorHandler("Please send data", 500));
    }
    if (!phone_code) {
      return next(new ErrorHandler("Please send data", 500));
    }
    if (!login_type) {
      return next(new ErrorHandler("Please send data", 500));
    }

    var otp = 1234;

    var google_id = "";
    var apple_id = "";
    var logintype1 = 0;

    if (login_type === "google") {
      google_id = social_id;
      logintype1 = 1;
    } else if (login_type === "apple") {
      apple_id = social_id;
      logintype1 = 2;
    }

    var sql =
      "SELECT user_id, mobile, otp_verify FROM user_master WHERE mobile = ? AND phone_code = ? AND delete_flag = 0";

    connection.query(sql, [mobile, phone_code], async (err, info) => {
      if (err) {
        return next(new ErrorHandler("Internal server error", 500));
      } else {
        if (info.length > 0) {
          //user already exist
          var user_id = info[0].user_id;

          if (info[0].otp_verify === 0) {
            var sql1 =
              "UPDATE user_master SET otp = ?, updatetime = now(), login_type = ?,login_type_first = ? WHERE user_id = ?";
            connection.query(
              sql1,
              [otp, logintype1, logintype1, user_id],
              (err, infomation) => {
                if (err) {
                  console.error("Database error:", err);
                  return next(new ErrorHandler("Internal server error", 500));
                } else {
                  var sql2 =
                    "Select * from user_master where user_id = ? AND delete_flag = 0";

                  connection.query([user_id], (err, results) => {
                    if (err) {
                      console.error("Database error:", err);
                      return next(
                        new ErrorHandler("Internal server error", 500)
                      );
                    } else {
                      if (results.length > 0) {
                        const userData = results[0];

                        response.status(200).json({
                          success: true,
                          msg: "Otp send successfully",
                          userData,
                        });
                      }
                    }
                  });
                }
              }
            );
          } else {
            return next(new ErrorHandler("Mobile number already exists", 500));
          }
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          var otp_verify = 0;
          if (login_type != "app") {
            var otp_verify = 1;
          }

          const insertUser =
            "INSERT INTO user_master(otp_verify,f_name,l_name, email, mobile,phone_code, password, user_type, otp,login_type, login_type_first, createtime, updatetime, google_id, apple_id,signup_step) VALUES (?,?, ?,?, ?,?, ?, ?, ?,  now(), now(), ?,?,?)";

          var values = [
            otp_verify,
            f_name,
            l_name,
            email,
            mobile,
            phone_code,
            hashedPassword,
            user_type,
            otp,
            logintype1,
            logintype1,
            google_id,
            apple_id,
            login_type != "app" ? 2 : 1,
          ];

          connection.query(insertUser, values, (err, data) => {
            if (err) {
              return next(new ErrorHandler("Internal server error", 500));
            } else {
              const user_id = data.insertId; //insertId built in function.
              var sql2 =
                "Select * from user_master where user_id = ? AND delete_flag = 0";

              connection.query([user_id], (err, results) => {
                if (err) {
                  console.error("Database error:", err);
                  return next(new ErrorHandler("Internal server error", 500));
                } else {
                  if (results.length > 0) {
                    const userData = results[0];
                    sendToken(userData, user_id, 201, res);
                  }
                }
              });
            }
          });
        }
      }
    });
  } catch (err) {
    console.error("Error:", err);
    return next(new ErrorHandler("Internal server error", 500));
  }
});
