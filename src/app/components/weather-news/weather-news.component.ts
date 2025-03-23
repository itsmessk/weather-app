import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface NewsItem {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

@Component({
  selector: 'app-weather-news',
  templateUrl: './weather-news.component.html',
  styleUrls: ['./weather-news.component.css']
})
export class WeatherNewsComponent implements OnInit, OnDestroy {
  newsItems: NewsItem[] = [];
  loading: boolean = true;
  error: string = '';
  private destroy$ = new Subject<void>();

  // Sample news data for development (in a real app, this would come from an API)
  private sampleNewsData: NewsItem[] = [
    {
      title: 'Record-Breaking Heat Wave Sweeps Across the Country',
      description: 'Temperatures soar to unprecedented levels as heat wave continues to impact multiple regions.',
      url: 'https://example.com/news/1',
      urlToImage: 'https://via.placeholder.com/300x200?text=Heat+Wave',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      source: { name: 'Weather News Network' }
    },
    {
      title: 'Tropical Storm Forms in the Atlantic, Expected to Strengthen',
      description: 'Meteorologists are tracking a newly formed tropical storm that could develop into a hurricane in the coming days.',
      url: 'https://example.com/news/2',
      urlToImage: 'https://via.placeholder.com/300x200?text=Tropical+Storm',
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      source: { name: 'Storm Center' }
    },
    {
      title: 'Drought Conditions Worsen in Western States',
      description: 'Water restrictions implemented as drought reaches critical levels in several western states.',
      url: 'https://example.com/news/3',
      urlToImage: 'https://via.placeholder.com/300x200?text=Drought',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      source: { name: 'Climate Report' }
    },
    {
      title: 'New Study Shows Impact of Climate Change on Weather Patterns',
      description: 'Research indicates significant shifts in seasonal weather patterns due to ongoing climate change.',
      url: 'https://example.com/news/4',
      urlToImage: 'https://via.placeholder.com/300x200?text=Climate+Study',
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      source: { name: 'Science Daily' }
    }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchNewsData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchNewsData(): void {
    // In a real application, you would fetch from a news API
    // For example:
    // this.http.get<any>('https://newsapi.org/v2/everything?q=weather&apiKey=YOUR_API_KEY')
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(
    //     response => {
    //       this.newsItems = response.articles;
    //       this.loading = false;
    //     },
    //     error => {
    //       console.error('Error fetching news:', error);
    //       this.error = 'Failed to load news data';
    //       this.loading = false;
    //     }
    //   );

    // For development, use sample data with a simulated delay
    setTimeout(() => {
      this.newsItems = this.sampleNewsData;
      this.loading = false;
    }, 1000);
  }

  openNewsLink(url: string): void {
    window.open(url, '_blank');
  }
}
