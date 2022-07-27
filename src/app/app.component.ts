import { Component, OnInit } from '@angular/core';
import { Comment } from './service/comments.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommentsService } from './service/comments.service';
import { map, Subscription } from 'rxjs';

const baseUrl = environment.baseUrl;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
  private subscription: Subscription = new Subscription();
  successMessage: any;
  addNewComment: any;
  comments: any;
  interval: any;
  
  constructor(private http: HttpClient, private commentsService: CommentsService) {}
  
  ngOnInit(): void {
    this.loadComments()

    // uncomment to turn off sync
    this.interval = setInterval(() => { 
      this.loadComments(); 
    }, 2000);

    //uncomment to purge
    //this.deleteComments()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    clearInterval(this.interval);
  }

  title = 'Comments';

  // reactive comment form
  commentForm = new FormGroup({
    name: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required),
  });

  // needed for validation
  get name() { return this.commentForm.get('name'); }

  get message() { return this.commentForm.get('message'); }

  // save that comment
  saveComment(){
    const body = {name: this.commentForm.value.name, message: this.commentForm.value.message}
    const http$ = this.http.post<Comment>(`${baseUrl}/createComment`, body); 

    http$.subscribe(
      res => this.addNewComment = res,
      err => console.log('Failed to save comment', err),
      () => this.successMessage = true
    );
  }

  // load those comments from the comment service
  loadComments(){
    this.commentsService.getComments().pipe(
      // organize by most recent
      map(comments => comments.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()))
    )
    .subscribe(comments => this.comments = comments,
      err => console.log('Error loading comments', err));
  }

  // get comment by id if route is needed
  getComment(id: any) {
    const http$ = this.http.get<Comment>(`${baseUrl}/getComment/${id}`); 
    http$.subscribe(
      res => console.log(res),
      err => console.log('Unable to retrieve single comment', err),
      () => console.log('Comment gotten!')
    );
  }

  // delete comments
  deleteComments() {
    const http$ = this.http.delete<Comment>(`${baseUrl}/deleteComments`); 
    http$.subscribe(
      res => console.log(res),
      err => console.log('HTTP error deleting comments', err),
      () => console.log('Feel that purge!')
    );
  }
  
}
