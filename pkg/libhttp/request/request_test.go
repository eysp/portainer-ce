package request

import (
	"net/http/httptest"
	"testing"
)

func TestRetrieveQueryParameter(t *testing.T) {
	tests := []struct {
		name     string
		url      string
		param    string
		optional bool
		want     string
		wantErr  bool
	}{
		{
			name:     "present parameter",
			url:      "http://example.com?name=value",
			param:    "name",
			optional: false,
			want:     "value",
			wantErr:  false,
		},
		{
			name:     "missing required parameter",
			url:      "http://example.com",
			param:    "name",
			optional: false,
			want:     "",
			wantErr:  true,
		},
		{
			name:     "missing optional parameter",
			url:      "http://example.com",
			param:    "name",
			optional: true,
			want:     "",
			wantErr:  false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest("GET", tt.url, nil)
			got, err := RetrieveQueryParameter(req, tt.param, tt.optional)

			if (err != nil) != tt.wantErr {
				t.Errorf("RetrieveQueryParameter() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("RetrieveQueryParameter() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestRetrieveNumericQueryParameter(t *testing.T) {
	tests := []struct {
		name     string
		url      string
		param    string
		optional bool
		want     int
		wantErr  bool
	}{
		{
			name:     "valid number",
			url:      "http://example.com?port=8080",
			param:    "port",
			optional: false,
			want:     8080,
			wantErr:  false,
		},
		{
			name:     "invalid number",
			url:      "http://example.com?port=abc",
			param:    "port",
			optional: false,
			want:     0,
			wantErr:  true,
		},
		{
			name:     "missing optional parameter",
			url:      "http://example.com",
			param:    "port",
			optional: true,
			want:     0,
			wantErr:  false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest("GET", tt.url, nil)
			got, err := RetrieveNumericQueryParameter(req, tt.param, tt.optional)

			if (err != nil) != tt.wantErr {
				t.Errorf("RetrieveNumericQueryParameter() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("RetrieveNumericQueryParameter() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestRetrieveBooleanQueryParameter(t *testing.T) {
	tests := []struct {
		name     string
		url      string
		param    string
		optional bool
		want     bool
		wantErr  bool
	}{
		{
			name:     "true value",
			url:      "http://example.com?enabled=true",
			param:    "enabled",
			optional: false,
			want:     true,
			wantErr:  false,
		},
		{
			name:     "false value",
			url:      "http://example.com?enabled=false",
			param:    "enabled",
			optional: false,
			want:     false,
			wantErr:  false,
		},
		{
			name:     "other value returns false",
			url:      "http://example.com?enabled=yes",
			param:    "enabled",
			optional: false,
			want:     false,
			wantErr:  false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest("GET", tt.url, nil)
			got, err := RetrieveBooleanQueryParameter(req, tt.param, tt.optional)

			if (err != nil) != tt.wantErr {
				t.Errorf("RetrieveBooleanQueryParameter() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("RetrieveBooleanQueryParameter() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestRetrieveArrayQueryParameter(t *testing.T) {
	tests := []struct {
		name  string
		url   string
		param string
		want  []string
	}{
		{
			name:  "multiple values",
			url:   "http://example.com?filter[]=foo&filter[]=bar",
			param: "filter",
			want:  []string{"foo", "bar"},
		},
		{
			name:  "single value",
			url:   "http://example.com?filter[]=test",
			param: "filter",
			want:  []string{"test"},
		},
		{
			name:  "no values returns nil",
			url:   "http://example.com",
			param: "filter",
			want:  nil,
		},
		{
			name:  "empty array",
			url:   "http://example.com?filter[]=",
			param: "filter",
			want:  []string{""},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest("GET", tt.url, nil)
			_ = req.ParseForm()
			got := RetrieveArrayQueryParameter(req, tt.param)

			if tt.want == nil {
				if got != nil {
					t.Errorf("RetrieveArrayQueryParameter() = %v, want nil", got)
				}
				return
			}

			if len(got) != len(tt.want) {
				t.Errorf("RetrieveArrayQueryParameter() length = %v, want %v", len(got), len(tt.want))
				return
			}
			for i := range got {
				if got[i] != tt.want[i] {
					t.Errorf("RetrieveArrayQueryParameter()[%d] = %v, want %v", i, got[i], tt.want[i])
				}
			}
		})
	}
}

func TestRetrieveNumberArrayQueryParameter(t *testing.T) {
	tests := []struct {
		name    string
		url     string
		param   string
		want    []int
		wantErr bool
	}{
		{
			name:    "valid integer array",
			url:     "http://example.com?ids[]=1&ids[]=2&ids[]=3",
			param:   "ids",
			want:    []int{1, 2, 3},
			wantErr: false,
		},
		{
			name:    "single value",
			url:     "http://example.com?ids[]=42",
			param:   "ids",
			want:    []int{42},
			wantErr: false,
		},
		{
			name:    "no values returns nil",
			url:     "http://example.com",
			param:   "ids",
			want:    nil,
			wantErr: false,
		},
		{
			name:    "invalid number in array",
			url:     "http://example.com?ids[]=1&ids[]=abc&ids[]=3",
			param:   "ids",
			want:    nil,
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest("GET", tt.url, nil)
			got, err := RetrieveNumberArrayQueryParameter[int](req, tt.param)

			if (err != nil) != tt.wantErr {
				t.Errorf("RetrieveNumberArrayQueryParameter() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if !tt.wantErr {
				if len(got) != len(tt.want) {
					t.Errorf("RetrieveNumberArrayQueryParameter() length = %v, want %v", len(got), len(tt.want))
					return
				}
				for i := range got {
					if got[i] != tt.want[i] {
						t.Errorf("RetrieveNumberArrayQueryParameter()[%d] = %v, want %v", i, got[i], tt.want[i])
					}
				}
			}
		})
	}
}
