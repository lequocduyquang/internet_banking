/**
 * @swagger
 * /api/v1/customer/list-contacts:
 *   get:
 *     tags:
 *       - Customer
 *     summary: "Lấy danh sách liên hệ"
 *     description: Lấy danh sách liên hệ
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     responses:
 *      200:
 *          description: Kết quả
 *          schema:
 *              type: object
 *              properties:
 *                  success:
 *                      type: string
 *                  contacts:
 *                      type: object
 *                      properties:
 *                        list_contact:
 *                          type: array
 *              example:
 *                {
 *                  "success": true,
 *                  "contacts": {
 *                    "list_contact": [
 *                      {
 *                        "reminder_name": "Customer 4",
 *                        "account_number": "7414483919"
 *                      }
 *                    ]
 *                  }
 *                }
 */
