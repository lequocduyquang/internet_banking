/**
 * @swagger
 * /api/v1/employee/payin:
 *   post:
 *     tags:
 *       - Employee
 *     summary: "Nạp tiền vào 1 tài khoản customer"
 *     description: Nạp tiền vào 1 tài khỏan customer
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: account_number
 *         type: string
 *         in: formData
 *         required: true
 *       - name: amount
 *         type: integer
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
 *                  transaction_log:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: integer
 *                        transaction_type:
 *                          type: integer
 *                        sender_account_number:
 *                          type: string
 *                        receiver_account_number:
 *                          type: string
 *                        amount:
 *                          type: integer
 *                        message:
 *                          type: string
 *                        transaction_method:
 *                          type: string
 *                        is_actived:
 *                          type: integer
 *                        is_notified:
 *                          type: integer
 *                        partner_code:
 *                          type: string
 *                        created_at:
 *                          type: date
 *                        updated_at:
 *                          type: date
 *
 *              example:
 *                {
 *                  "success": true,
 *                  "customer": {
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
 *                  "transaction_log": {
 *                    "id": 45,
 *                    "transaction_type": 1,
 *                    "sender_account_number": "GDV",
 *                    "receiver_account_number": "7340722378",
 *                    "amount": 100000,
 *                    "message": "Customer 2 nộp 100000vnd vào tài khoản",
 *                    "transaction_method": null,
 *                    "is_actived": null,
 *                    "is_notified": null,
 *                    "partner_code": null,
 *                    "created_at": "2020-06-28T03:04:26.928Z",
 *                    "updated_at": "2020-06-28T03:04:26.928Z"
 *                  }
 *                }
 *
 */
