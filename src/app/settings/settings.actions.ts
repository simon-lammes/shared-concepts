import {TimeSpan} from './settings.model';

export class CooldownTimeChanged {
    static readonly type = '[Settings] Settings changed';

    constructor(public cooldownTime: TimeSpan) {
    }
}
