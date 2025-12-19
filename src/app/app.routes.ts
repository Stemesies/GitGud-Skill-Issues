import { Routes } from '@angular/router';
import { IssuesList } from './src/components/IssuesList';
import { IssueCreator } from './src/components/IssueCreator';
import { IssueDisplayer } from './src/components/IssueDisplayer';

export const routes: Routes = [
    { path: '', component: IssuesList, title: 'Issues · Stemie/GitGud' },
    { path: 'new', component: IssueCreator, title: 'New issue' },
    { path: ':id', component: IssueDisplayer }
];
