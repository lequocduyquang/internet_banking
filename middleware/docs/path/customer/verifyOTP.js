/**
 * @swagger
 * /api/v1/auth/customer/verify/code:
 *   post:
 *     tags:
 *       - Customer
 *     summary: "Verify OTP"
 *     description: Verify OTP
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         type: string
 *         in: formData
 *         required: true
 *       - name: OTP
 *         type: string
 *         in: formData
 *         required: true
 *     responses:
 *      200:
 *          description: Kết quả
 *          schema:
 *              type: object
 *              properties:
 *                  valid:
 *                          type: string
 *              example:
 *                {
 *                  valid: true,
 *                }
 *
 */
