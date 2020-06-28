/**
 * @swagger
 * /api/v1/admin/employees:
 *   post:
 *     tags:
 *       - Admin
 *     summary: "Tạo 1 tài khoản employee"
 *     description: Tạo 1 tài khỏan employee
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
 *     responses:
 *      200:
 *          description: Kết quả
 *          schema:
 *              type: object
 *              properties:
 *                  success:
 *                      type: string
 *                  employee:
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
 *                        created_at:
 *                          type: date,
 *                        updated_at:
 *                          type: date
 *                  accessToken: string
 *                  refreshToken: string
 *              example:
 *                {
 *                  "success": true,
 *                  "user": {
 *                    "status": 1,
 *                    "id": 4,
 *                    "username": "quangle",
 *                    "password": "$2b$10$r9NYiJLssdUEWmBaKPvs1OgUPnhU0lfkMtAsTa59Dd3jhEkwnI6BS",
 *                    "email": "duyquangbtx@gmail.com",
 *                    "created_at": "2020-06-28T01:21:29.272Z",
 *                    "updated_at": "2020-06-28T01:21:29.272Z"
 *                  },
 *                }
 *
 */
