import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoticiasService } from './noticias.service';

describe('NoticiasService', () => {
  let service: NoticiasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NoticiasService],
    });
    service = TestBed.inject(NoticiasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
