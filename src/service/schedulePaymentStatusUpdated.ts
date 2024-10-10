import { knex } from "../../database/knex"
import cron from "node-cron"

export function schedulePaymentStatusUpdate() {
    cron.schedule("* * * * *", async () => {
        try {
            const data = new Date()

            const userToUpdate = await knex("users")
                .where('is_paid', true)
                .andWhere('payment_due_date', '<', data)

            if (userToUpdate.length > 0) {
                await knex("users")
                    .whereIn("register", userToUpdate.map(user => user.register))
                    .update({
                        is_paid: false,
                        updated_at: knex.fn.now()
                    })
            }

        } catch (error) {
            console.log(error)
        }
    })


}