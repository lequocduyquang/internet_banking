/**
 * @swagger
 * /api/v1/customer/my-account:
 *   get:
 *     tags:
 *       - Customer
 *     summary: "Xem thông tin cá nhân"
 *     description: Xem thông tin cá nhân
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
 *                  my_account:
 *                      type: object
 *                      properties:
 *                        account_number:
 *                          type: string
 *                        account_balance:
 *                          type: string
 *              example:
 *                {
 *                  "success": true,
 *                  "my_account": {
 *                    "account_number": "7496690248",
 *                    "account_balance": 0
 *                  }
 *                }
 */
