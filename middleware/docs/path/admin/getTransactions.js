/**
 * @swagger
 * /api/v1/admin/transactions:
 *   get:
 *     tags:
 *       - Admin
 *     summary: "Lấy danh sách transactions"
 *     description: Lấy danh sách transactions
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
 *                  sum_amount:
 *                      type: integer
 *              example:
 *                  "page": 1
 *                  "per_page": 20
 *                  "total_pages": "1"
 *                  "total": 5
 *                  "items": [
 *                     {
 *                        "id": 25,
 *                        "transaction_type": 1,
 *                        "transaction_method": null,
 *                        "is_actived": null,
 *                        "is_notified": null,
 *                        "sender_account_number": "7414483919",
 *                        "receiver_account_number": null,
 *                        "amount": 2000000,
 *                        "message": "le hoang quy nộp 2000000vnd vào tài khoản",
 *                        "partner_code": null,
 *                        "updated_at": "2020-06-19T07:15:47.782Z",
 *                        "created_at": "2020-06-19T07:15:47.782Z"
 *                     },
 *                  ]
 *                  "sum_amount": 8619999
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
