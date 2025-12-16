import { Routes } from '@angular/router';
import { IssuesList } from './src/components/IssuesList';
import { IssueCreator } from './src/components/IssueCreator';

export const routes: Routes = [
    { path: '', component: IssuesList },
    { path: 'new', component: IssueCreator }
];
