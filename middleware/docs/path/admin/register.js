/**
 * @swagger
 * /api/v1/auth/admin/register:
 *   post:
 *     tags:
 *       - Admin
 *     summary: "Đăng kí 1 tài khoản admin mới"
 *     description: Đăng kí 1 tài khỏan admin mới
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         type: string
 *         in: formData
 *         required: true
 *       - name: password
 *         type: string
 *         in: formData
 *         required: true
 *       - name: email
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
 *                  admin:
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
 *                        created_at:
 *                          type: date,
 *                        updated_at:
 *                          type: date
 *              example:
 *                {
 *                  "success": true,
 *                  "admin": {
 *                    "id": 4,
 *                    "username": "Admin Banking",
 *                    "password": "$2b$10$HAaqZ1/I1aUjFFHttpPB2eYlbQKmBjUOnSiL1EFtzTxU55N58hZOS",
 *                    "email": "jobfit.banking@gmail.com",
 *                    "created_at": "2020-06-28T01:21:29.272Z",
 *                    "updated_at": "2020-06-28T01:21:29.272Z"
 *                  }
 *                }
 *
 */
