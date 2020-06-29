/**
 * @swagger
 * /api/v1/customer/my-account:
 *   get:
 *     tags:
 *       - Customer
 *     summary: "Tìm 1 tài khoản customer"
 *     description: Tìm 1 tài khỏan customer
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
