import { Routes } from '@angular/router';
import { IssuesList } from './src/components/IssuesList';
import { IssueCreator } from './src/components/IssueCreator';
import { IssueDisplayer } from './src/components/IssueDisplayer';

export const routes: Routes = [
    { path: '', component: IssuesList },
    { path: 'new', component: IssueCreator },
    { path: ':id', component: IssueDisplayer }
];
