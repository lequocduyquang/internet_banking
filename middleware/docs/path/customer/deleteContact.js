/**
 * @swagger
 * /api/v1/customer/list-contacts/{account_number}:
 *   delete:
 *     tags:
 *       - Customer
 *     summary: "Xóa 1 tài khoản contact"
 *     description: Xóa 1 tài khoản contact
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: account_number
 *         type: string
 *         in: path
 *         required: true
 *         description: tài khoản contact
 *     responses:
 *      200:
 *          description: Kết quả
 *          schema:
 *              type: object
 *              properties:
 *                  message:
 *                      type: string
 *                  data:
 *                      type: object
 *                      properties:
 *                        message:
 *                          type: string
 *                        contact:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: integer
 *                            username:
 *                              type: string
 *                            password:
 *                              type: string
 *                            email:
 *                              type: string
 *                            account_number:
 *                              type: string
 *                            phone:
 *                              type: string
 *                            list_contact:
 *                              type: array
 *              example:
 *                {
 *                  "success": true,
 *                  "contact": {
 *                    "id": 21,
 *                    "username": "customer 4",
 *                    "fullname": "Customer 4",
 *                    "email": "customer4@gmail.com",
 *                    "password": "$2b$10$1OZi/r.za5dx/ao4AOlAKOqAi6sTl7njhbfo.CFA6y3dL9186dwTy",
 *                    "status": 1,
 *                    "account_number": "7496690248",
 *                    "account_balance": 0,
 *                    "phone": "123456789",
 *                    "address": null,
 *                    "list_contact": [],
 *                  }
 *                }
 *      401:
 *          description: Lỗi về xác thực Authorized
 *          schema:
 *              type: object
 *              properties:
 *                  errors:
 *                      type: array
 *                      items:
 *                          message:
 *                              type: string
 *                      example:
 *                          {
 *                            "errors": [
 *                              {
 *                                "message": "Not authorized"
 *                              }
 *                            ]
 *                          }
 */
