import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectResolver } from './project-resolver.service';
import { HomeComponent } from './pages/home.component';

export const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: 'home',
          component: HomeComponent
        },
        // {
        //   path: 'projects/:id',
        //   component: ProjectDetailsComponent,
        //   resolve: {
        //     project: ProjectResolver
        //   }
        // }
      ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
