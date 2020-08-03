/**
 * @swagger
 * /api/v1/customer/create-contact:
 *   post:
 *     tags:
 *       - Customer
 *     summary: "Tạo 1 liên hệ"
 *     description: Tạo 1 liên hệ
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: reminder_name
 *         type: string
 *         in: formData
 *       - name: account_number
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
 *                  contact:
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
 *                    "list_contact": [
 *                       {
 *                          "reminder_name": "Customer 4",
 *                          "account_number": "7414483919"
 *                       }
 *                    ],
 *                  }
 *                }
 *
 */
