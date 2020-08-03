/**
 * @swagger
 * /api/v1/auth/customer/reset_password:
 *   put:
 *     tags:
 *       - Customer
 *     summary: "Reset mật khẩu"
 *     description: Reset mật khẩu
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: newPassword
 *         type: string
 *         in: formData
 *         required: true
 *       - name: email
 *         type: string
 *         in: formData
 *         required: true
 *     responses:
 *      200:
 *          description: Kết quả
 *          schema:
 *              type: object
 *              properties:
 *                  user:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: integer
 *                        username:
 *                          type: string
 *                        password:
 *                          type: string
 *                        email:
 *                          type: string
 *                        account_number:
 *                          type: string
 *                        phone:
 *                          type: string
 *                        list_contact:
 *                          type: array
 *                  accessToken:
 *                          type: string
 *                  refreshToken:
 *                          type: string
 *              example:
 *                {
 *                  "user": {
 *                    "id": 21,
 *                    "username": "customer 4",
 *                    "fullname": "Customer 4",
 *                    "email": "customer4@gmail.com",
 *                    "password": "12345",
 *                    "status": 1,
 *                    "account_number": "7496690248",
 *                    "account_balance": 0,
 *                    "phone": "123456789",
 *                    "address": null,
 *                    "list_contact": [],
 *                  },
 *                  accessToken: "",
 *                  refreshToken: ""
 *                }
 *
 */
