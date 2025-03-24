import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WeatherNews } from '../../models/weatherNews';
import { Input } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-weather-news',
  templateUrl: './weather-news.component.html',
  styleUrls: ['./weather-news.component.css']
})
export class WeatherNewsComponent implements OnInit, OnDestroy {
  @Input() news: WeatherNews = {
    source: {
      id: '',
      name: ''
    },
    author: '',
    title: '',
    description: '',
    url: '',
    urlToImage: '',
    publishedAt: '',
    content : ''
  };
  
  newsItems: WeatherNews[] = [];
  loading: boolean = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.fetchNewsData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchNewsData() {
    this.loading = true;
    this.error = null;
    
    this.api.getNewsAPI()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          if (data && data.articles) {
            // Map articles and limit to only 4 items
            this.newsItems = data.articles
              .slice(0, 4)
              .map((article: any) => ({
                source: article.source,
                author: article.author,
                title: article.title,
                description: article.description,
                url: article.url,
                urlToImage: article.urlToImage,
                publishedAt: article.publishedAt,
                content: article.content
              }));
          } else {
            this.newsItems = [this.news];
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching news data:', err);
          this.error = 'Unable to load weather news. Please try again later. This error occurs because we are using a free API key from newsapi.org. To receive news updates in production, we need to upgrade to a paid API key from newsapi.org.';
          this.loading = false;
        }
      });
  }

  retryFetch() {
    this.fetchNewsData();
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}