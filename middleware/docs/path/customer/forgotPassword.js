/**
 * @swagger
 * /api/v1/auth/customer/forgot_password:
 *   post:
 *     tags:
 *       - Customer
 *     summary: "Quên mật khẩu"
 *     description: Quên mật khẩu
 *     produces:
 *       - application/json
 *     parameters:
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
 *                  result:
 *                          type: string
 *              example:
 *                {
 *                  result: "<96fd54aa-df2b-3f2b-0f2a-5559dfb39ea8@gmail.com>",
 *                }
 *
 */
