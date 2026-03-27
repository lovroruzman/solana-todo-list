import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaTodoList } from "../target/types/solana_todo_list";
import { assert } from "chai";

describe("solana_todo_list", () => {
  // Postavljamo providera (tvoj novčanik)
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaTodoList as Program<SolanaTodoList>;

  it("Puni proces: Dodaj -> Označi kao gotovo -> Provjeri", async () => {
    const taskAccount = anchor.web3.Keypair.generate();

    console.log("🚀 Kreiram zadatak...");
    await program.methods
      .addTask("Nauci Solana development")
      .accounts({
        task: taskAccount.publicKey,
        author: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([taskAccount])
      .rpc();

    let taskState = await program.account.task.fetch(taskAccount.publicKey);
    console.log("   Stanje nakon kreiranja: Je li gotovo?", taskState.isDone);
    assert.ok(taskState.isDone === false);

    console.log("✨ Označavam zadatak kao rješen...");
    

    await program.methods
      .markDone(true) 
      .accounts({
        task: taskAccount.publicKey,
        author: provider.wallet.publicKey,
      })

      .rpc();

   
    taskState = await program.account.task.fetch(taskAccount.publicKey);
    console.log("   Stanje nakon ažuriranja: Je li gotovo?", taskState.isDone);
    
    assert.ok(taskState.isDone === true);
    console.log("🎉 USPJEH! Podatak na blockchainu je izmijenjen.");
  });
});