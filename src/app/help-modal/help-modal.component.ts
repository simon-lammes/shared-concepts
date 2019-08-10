import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {HelpSection} from './help-section.model';

@Component({
    selector: 'app-help-modal',
    templateUrl: './help-modal.component.html',
    styleUrls: ['./help-modal.component.scss'],
})
export class HelpModalComponent implements OnInit {

    @Input() title: string;
    @Input() helpSections: HelpSection[];

    constructor(private modalController: ModalController) {
    }

    ngOnInit() {
    }

    onDismissModal() {
        this.modalController.dismiss();
    }
}
