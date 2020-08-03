/**
 * @swagger
 * /api/v1/customer/history/{account_number}:
 *   get:
 *     tags:
 *       - Customer
 *     summary: "Lấy lịch sử giao dịch theo account number"
 *     description: Lấy lịch sử giao dịch theo account number
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: account_number
 *         type: integer
 *         in: path
 *         required: true
 *         description: Account number
 *     responses:
 *      200:
 *          description: Kết quả
 *          schema:
 *              type: object
 *              properties:
 *                  page:
 *                      type: integer
 *                  per_page:
 *                      type: integer
 *                  total_pages:
 *                      type: integer
 *                  total:
 *                      type: integer
 *                  items:
 *                      type: array
 *              example:
 *                  "page": 1
 *                  "per_page": 20
 *                  "total_pages": "1"
 *                  "total": 5
 *                  "items": [
 *                     "id": 39,
 *                     "transaction_type": 1,
 *                     "transaction_method": null,
 *                     "is_actived": null,
 *                     "is_notified": null,
 *                     "sender_account_number": "2124014560",
 *                     "receiver_account_number": null,
 *                     "amount": 50000,
 *                     "message": "lequocduyquang nộp 50000vnd vào tài khoản",
 *                     "partner_code": null,
 *                     "updated_at": "2020-06-20T01:23:06.134Z",
 *                     "created_at": "2020-06-20T01:23:06.134Z"
 *                  ]
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
