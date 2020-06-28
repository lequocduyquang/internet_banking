/**
 * @swagger
 * /api/v1/employee/create-customer:
 *   post:
 *     tags:
 *       - Employee
 *     summary: "Tạo 1 tài khoản customer"
 *     description: Tạo 1 tài khỏan customer
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: password
 *         type: string
 *         in: formData
 *         required: true
 *       - name: email
 *         type: string
 *         in: formData
 *         required: true
 *       - name: username
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
 *       - name: address
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
 *                        status:
 *                          type: integer
 *                        id:
 *                          type: integer
 *                        username:
 *                          type: string
 *                        password:
 *                          type: string
 *                        email:
 *                          type: string
 *                        fullname:
 *                          type: string
 *                        phone:
 *                          type: string
 *                        address:
 *                          type: string
 *                        account_number:
 *                          type: integer
 *                        account_balance:
 *                          type: integer
 *                        list_contact:
 *                          type: array
 *                        created_at:
 *                          type: date
 *                        updated_at:
 *                          type: date
 *              example:
 *                {
 *                  "success": true,
 *                  "user": {
 *                    "id": 19,
 *                    "username": "customer-2",
 *                    "password": "$2b$10$51QwxzN52YvHY30h4JVjkugtzOa10Ov.rk3vLCcAo.FyiEtxd6nXy",
 *                    "email": "customer2@gmail.com",
 *                    "fullname": "Customer 2",
 *                    "phone": "0123456789",
 *                    "address": "Quận 1",
 *                    "account_number": "7340722378",
 *                    "account_balance": 0,
 *                    "status": 1,
 *                    "list_contact": [],
 *                    "created_at": "2020-06-28T02:43:38.553Z",
 *                    "updated_at": "2020-06-28T02:43:38.553Z"
 *                  },
 *                }
 *
 */
