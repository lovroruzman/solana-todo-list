use anchor_lang::prelude::*;

declare_id!("2CRb8pBFCyfDensBbjR6H5GQ6ZsG1S87LboJ2FwdkswB"); // OVO MIJENJAMO KASNIJE!

#[program]
pub mod solana_todo_list {
    use super::*;

    pub fn add_task(ctx: Context<AddTask>, description: String) -> Result<()> {
        let task = &mut ctx.accounts.task;
        let author = &ctx.accounts.author;
        let clock = Clock::get()?;

        if description.chars().count() > 400 {
            return Err(ErrorCode::TextTooLong.into());
        }

        task.author = *author.key;
        task.is_done = false;
        task.description = description;
        task.created_at = clock.unix_timestamp;

        Ok(())
    }

    pub fn mark_done(ctx: Context<MarkDone>, is_done: bool) -> Result<()> {
        let task = &mut ctx.accounts.task;
        task.is_done = is_done;
        Ok(())
    }

    pub fn update_task(ctx: Context<UpdateTask>, new_description: String) -> Result<()> {
        let task = &mut ctx.accounts.task;
        if new_description.chars().count() > 400 {
            return Err(ErrorCode::TextTooLong.into());
        }
        task.description = new_description;
        Ok(())
    }

    pub fn delete_task(_ctx: Context<DeleteTask>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct AddTask<'info> {
    #[account(init, payer = author, space = 8 + 32 + 1 + 4 + 400 + 8)]
    pub task: Account<'info, Task>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MarkDone<'info> {
    #[account(mut, has_one = author)]
    pub task: Account<'info, Task>,
    pub author: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeleteTask<'info> {
    #[account(mut, has_one = author, close = author)]
    pub task: Account<'info, Task>,
    #[account(mut)]
    pub author: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateTask<'info> {
    #[account(mut, has_one = author)]
    pub task: Account<'info, Task>,
    pub author: Signer<'info>,
}

#[account]
pub struct Task {
    pub author: Pubkey,
    pub is_done: bool,
    pub description: String,
    pub created_at: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Text is too long")]
    TextTooLong,
}