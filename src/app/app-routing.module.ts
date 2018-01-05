import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { ArticleComponent } from './article/article.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetailComponent } from './detail/detail.component';
import { FormComponent } from './form/form.component';

const routes: Routes = [
    /*{
        path: 'login',
        component: LoginComponent
    },*/
    {
        path: '',
        component: MainComponent,
        children: [
            {
                component: DashboardComponent,
                path: '',
            },
            /*{
                path: 'product',
                component: DashboardProductComponent,
                children: [
                    {
                        path: '',
                        component: ProductOverviewComponent
                    },
                    {
                        path: 'stats',
                        component: ProductStatsComponent
                    },
                    {
                        path: 'features',
                        children: [
                            {
                                path: '',
                                component: ProductFeaturesComponent
                            },
                            {
                                path: 'add',
                                component: FeaturesFormComponent
                            },
                            {
                                path: ':id/delete',
                                component: FeaturesFormComponent
                            },
                            {
                                path: ':id/edit',
                                component: FeaturesFormComponent
                            },
                        ]
                    },
                ]
            },
            {
                path: 'logs',
                component: LogsComponent
            },
            */
            {
                path: 'item/:id',
                component: DetailComponent
            },
            {
                path: 'form',
                component: FormComponent
            },
            //{ path: '', loadChildren: './users/users.module#UsersModule' },
        ],
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { useHash: true }),
    ],
    exports: [
        RouterModule,
    ]
})
export class AppRoutingModule { }
export const routedComponents: any[] = [
    MainComponent,
    DashboardComponent,
    DetailComponent,
    ArticleComponent,
    FormComponent
];
