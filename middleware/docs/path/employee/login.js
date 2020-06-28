/**
 * @swagger
 * /api/v1/auth/employee/login:
 *   post:
 *     tags:
 *       - Employee
 *     summary: "Đăng nhập 1 tài khoản employee"
 *     description: Đăng nhập 1 tài khỏan employee
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
