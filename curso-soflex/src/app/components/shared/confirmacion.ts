import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'app-confirmacion-component',
    templateUrl: './confirmacion.html',
})

export class ConfirmacionComponent {

    constructor(public dialogRef: MatDialogRef<ConfirmacionComponent>) {}

    cancel(): void{
        this.dialogRef.close();
    }
}