/**
 * @swagger
 * /api/v1/auth/customer/login:
 *   post:
 *     tags:
 *       - Customer
 *     summary: "Đăng nhập 1 tài khoản customer"
 *     description: Đăng nhập 1 tài khỏan customer
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: password
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
 *                  success:
 *                      type: string
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
 *                        created_at:
 *                          type: date,
 *                        updated_at:
 *                          type: date
 *                  accessToken: string
 *                  refreshToken: string
 *              example:
 *                {
 *                  "success": true,
 *                  "user": {
 *                    "id": 15,
 *                    "username": "Đăng Quang",
 *                    "fullname": "Dang Quang",
 *                    "account_number": "7496690248",
 *                    "account_balance": 0,
 *                    "phone": "123456789",
 *                    "address": null,
 *                    "list_contact": [],
 *                    "password": "$2b$10$HAaqZ1/I1aUjFFHttpPB2eYlbQKmBjUOnSiL1EFtzTxU55N58hZOS",
 *                    "email": "dangquang@gmail.com",
 *                    "status": 1,
 *                    "created_at": "2020-06-28T01:21:29.272Z",
 *                    "updated_at": "2020-06-28T01:21:29.272Z"
 *                  },
 *                  "accessToken": "",
 *                  "refreshToken": ""
 *                }
 *
 */
