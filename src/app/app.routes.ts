import { Routes } from '@angular/router';
import { IssuesList } from './src/components/IssuesList';
import { IssueCreator } from './src/components/IssueCreator';
import { IssueDisplayer } from './src/components/IssueDisplayer';
import { LabelList } from './src/components/LabelList';

export const routes: Routes = [
    { path: '', component: IssuesList, title: 'Issues · Stemie/GitGud' },
    { path: 'new', component: IssueCreator, title: 'New issue' },
    { path: 'labels', component: LabelList, title: 'Labels · Stemie/GitGud' },
    { path: ':id', component: IssueDisplayer }
];
