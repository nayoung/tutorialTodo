import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AdminService} from "../../admin.service";
import {NewsVO} from "../../../domain/news.vo";
import {PlatformLocation} from "@angular/common";
import {MatDialog, MatSnackBar, MatSnackBarConfig} from "@angular/material";
import {ViewDialogComponent} from "./view.dialog.component";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewComponent implements OnInit {
  news: NewsVO;

  constructor(private route: ActivatedRoute, private adminService: AdminService, private location: PlatformLocation,
              private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let news_id = +params['news_id'];
      this.adminService.findOneNews(news_id)
        .then((res: NewsVO) => {
          this.news = res;
        });
    });
  }

  gotoModify() {
    let path = this.location.pathname;
    this.router.navigateByUrl(path.replace('view', 'modify'));
  }

  confirmDelete(news: NewsVO) {
/*    const result = confirm('삭제하시겠습니까?');
     if (result) {
     this.adminService.removeNews(news.news_id)
     .then(value => {
     if (value['result'] === 0) {
     let conf = new MatSnackBarConfig();
     conf.duration = 3000;
     this.snackBar.open('삭제하였습니다.', null, conf);
     this.router.navigate(['../..'], {relativeTo: this.route});
     }
     });
     }*/

    let dialogRef = this.dialog.open(ViewDialogComponent, {
      data: {content: '삭제하시겠습니까?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { // 삭제하기
        this.adminService.removeNews(news.news_id)
          .then(value => {
            if (value['result'] === 0) {
              let conf = new MatSnackBarConfig();
              conf.duration = 3000;
              this.snackBar.open('삭제하였습니다.', null, conf);
              // 뉴스 목록이 갱신되었음을 알린다.
              this.adminService.refresh.next(true);
              this.router.navigate(['../..'], {relativeTo: this.route});
            }
          });
      }
    });
  }
}
