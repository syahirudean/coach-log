import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShellComponent } from './components/shell/shell.component';



@NgModule({
  declarations: [
    ShellComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ShellComponent
  ]
})
export class SharedModule { }
