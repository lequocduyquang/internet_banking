/**
 * @swagger
 * /api/v1/auth/customer/register:
 *   post:
 *     tags:
 *       - Customer
 *     summary: "Đăng kí 1 tài khoản customer mới"
 *     description: Đăng kí 1 tài khỏan customer mới
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         type: string
 *         in: formData
 *         required: true
 *       - name: password
 *         type: string
 *         in: formData
 *         required: true
 *       - name: email
 *         type: string
 *         in: formData
 *         required: true
 *       - name: fullname
 *         type: string
 *         in: formData
 *         required: true
 *       - name: phone
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
 *                  customer:
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
 *              example:
 *                {
 *                  "success": true,
 *                  "customer": {
 *                    "id": 15,
 *                    "username": "Đăng Quang",
 *                    "password": "$2b$10$HAaqZ1/I1aUjFFHttpPB2eYlbQKmBjUOnSiL1EFtzTxU55N58hZOS",
 *                    "email": "dangquang@gmail.com",
 *                    "phone": "123456789",
 *                    "fullname": "Customer 4",
 *                    "account_number": "7496690248",
 *                    "account_balance": 0,
 *                    "list_contact": [],
 *                    "address": null,
 *                    "status": 1,
 *                    "created_at": "2020-06-28T01:21:29.272Z",
 *                    "updated_at": "2020-06-28T01:21:29.272Z"
 *                  }
 *                }
 *
 */
