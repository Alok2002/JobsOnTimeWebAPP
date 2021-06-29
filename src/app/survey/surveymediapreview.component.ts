import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { SurveyServices } from '../services/survey.services';

@Component({
  selector: 'SurveyMediaPreviewComponent',
  templateUrl: './surveymediapreview.component.html'
})

export class SurveyMediaPreviewComponent implements OnChanges, OnInit {
  @Input() mediaUrl: string;
  viewHtml: any;

  constructor(private activateroute: ActivatedRoute, private surveyservice: SurveyServices, 
    private sanitizer: DomSanitizer) {
    console.log(this.mediaUrl);
  }

  ngOnInit() {
    this.generateView(this.mediaUrl);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    const data: SimpleChange = changes.mediaUrl;
    this.generateView(data.currentValue);
  }

  generateView(mediaUrl) {
    console.log(mediaUrl);
    if (mediaUrl == null || mediaUrl == '') this.viewHtml = "<span class='text-danger'>Invalid Media</span>";
    else {
      console.log(mediaUrl);
      //mediaUrl = mediaUrl.trim();
      if (!mediaUrl.toLowerCase().startsWith("http://") && !mediaUrl.toLowerCase().startsWith("https://")) {
        mediaUrl = "http://" + mediaUrl;
      }

      if (mediaUrl.toLowerCase().endsWith("gif") || mediaUrl.toLowerCase().endsWith("jpg") || mediaUrl.toLowerCase().endsWith("png") || mediaUrl.toLowerCase().endsWith("bmp")) {
        this.viewHtml = '<img src="' + mediaUrl + '" style="width:100%" class="img-responsive" />';
      }
      else if (mediaUrl.toLowerCase().search("youtube.com")) {
        this.viewHtml = this.getSanitizerHtml('<iframe id="video" width="420" height="315" src="' + mediaUrl + '" frameborder="0" allowfullscreen></iframe></div>');
      }
      else {
        this.viewHtml = this.getSanitizerHtml('<video controls src=' + this.getSanitizerUrl(mediaUrl) + '>' +
          '<a href=' + mediaUrl + ' target="_blank">Click here to view a video associated with this question.</a></video>');
      }
    }
  }

  getSanitizerUrl(url){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getSanitizerHtml(html){
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
