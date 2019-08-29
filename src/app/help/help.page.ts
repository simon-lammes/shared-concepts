import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-help',
    templateUrl: './help.page.html',
    styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

    // Contains all expanded sections as keys with the value 'true'.
    // If a section is not expanded it should not be contained in this object
    // as this would make the resulting query param url longer.
    // This is obviously more complicated than just an array with all expanded sections
    // but this did not work properly.
    sectionExpanded: { [key: string]: 'true' } = {};

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.activatedRoute.queryParams
            .subscribe(params => {
                // The params object is immutable, so we need to create a new, modifiable copy.
                this.sectionExpanded = {...params};
            });
    }

    changeSectionExpanded(section: string, isExpanded: boolean) {
        // we could use 'false' instead of undefined but with undefined we get a shorter url because
        // query param keys with the value undefined are ignored
        this.sectionExpanded[section] = isExpanded ? 'true' : undefined;
        this.router.navigate(['.'], {relativeTo: this.activatedRoute, queryParams: {...this.sectionExpanded}});
    }
}
