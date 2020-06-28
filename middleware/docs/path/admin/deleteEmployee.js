/**
 * @swagger
 * /api/v1/admin/employees/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: "Xóa 1 tài khoản employee"
 *     description: Xóa 1 tài khoản employee
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
 *                  message:
 *                      type: string
 *                  data:
 *                      type: object
 *                      properties:
 *                        message:
 *                          type: string
 *                        employee:
 *                          type: object
 *                          properties:
 *                            status:
 *                              type: integer
 *                            id:
 *                              type: integer
 *                            username:
 *                              type: string
 *                            password:
 *                              type: string
 *                            email:
 *                              type: string
 *                            created_at:
 *                              type: date,
 *                            updated_at:
 *                              type: date
 *              example:
 *                  {
 *                  "message": "Delete successfullly",
 *                  "employee": {
 *                        "id": 10,
 *                        "username": "employee 3",
 *                        "email": "employee3@gmail.com",
 *                        "status": 0,
 *                        "updated_at": "2020-06-13T02:35:31.606Z",
 *                        "created_at": "2020-06-13T02:35:31.606Z"
 *                    }
 *                  }
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
