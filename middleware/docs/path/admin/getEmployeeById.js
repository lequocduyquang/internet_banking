/**
 * @swagger
 * /api/v1/admin/employees/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: "Lấy employee theo Id"
 *     description: Lấy employee theo Id
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         type: integer
 *         in: path
 *         required: true
 *         description: Mã employee id
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
 *                     {
 *                        "id": 10,
 *                        "username": "employee 3",
 *                        "email": "employee3@gmail.com",
 *                        "status": 1,
 *                        "updated_at": "2020-06-13T02:35:31.606Z",
 *                        "created_at": "2020-06-13T02:35:31.606Z"
 *                     },
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
