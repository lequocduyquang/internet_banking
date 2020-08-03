/**
 * @swagger
 * /api/v1/transfer/internal/verify:
 *   post:
 *     tags:
 *       - Customer
 *     summary: "Verify 1 tài khoản liên hệ trước khi chuyển tiền"
 *     description: Verify 1 tài khoản liên hệ trước khi chuyển tiền
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: receiver_account_number
 *         type: string
 *         in: formData
 *         required: true
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

 *              example:
 *                {
 *                  "message": "Success",
 *                  "data": {
 *                      "username": "hoangquy",
 *                      "account_number": "4230671125"
 *                  },
 *                }
 *
 */
