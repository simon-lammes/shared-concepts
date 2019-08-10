import {ModalController} from '@ionic/angular';
import {HelpSection} from '../help-modal/help-section.model';
import {HelpModalComponent} from '../help-modal/help-modal.component';

export function showHelpModalForConceptsPage(modalController: ModalController) {
    const helpSections: HelpSection[] = [
            {
                topic: 'Choosing a concept to study',
                helpText: 'Concepts usually rely on other concepts. ' +
                    'By clicking on concepts, you get to see concepts which build the \"foundation\". ' +
                    'This means the more you traverse, the more specific the concept, the less broad the concept you are about to study.'
            }
        ]
    ;
    modalController.create({
        component: HelpModalComponent,
        componentProps: {
            helpSections,
            title: 'Concepts'
        }
    }).then(modalElement => modalElement.present());
}
