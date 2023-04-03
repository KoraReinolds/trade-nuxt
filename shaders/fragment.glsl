#define RGB_DARK vec3(.1)
#define RGB_GRAY_2 vec3(.2)
#define RGB_GREEN vec3(.0,.5,.0)
#define RGB_RED vec3(.5,.0,.0)
#define PIXEL_SIZE 1.

varying vec2 st;
uniform vec2 u_resolution;
uniform vec2 u_grid;
uniform vec2 u_grid_offset;
uniform vec2 u_hl;
uniform sampler2D u_candles;

float fill(float v,float th){
  return step(v,th);
}

float stroke(float v,float c,float w){
  return fill(v,c+w/2.)-fill(v,c-w/2.);
}

float stroke_hl(float v,float t,float b){
  return stroke(v,(t+b)/2.,abs(t-b));
}

float grid(vec2 uv,vec2 scale,vec2 thickness){
  vec2 grid_uv=uv;
  grid_uv=fract(grid_uv*scale);
  vec2 ps=thickness*scale;
  float grid_x=fill(grid_uv.x,ps.x);
  float grid_y=fill(grid_uv.y,ps.y);
  
  return max(grid_x,grid_y);
}

void main(){
  vec3 scene=RGB_DARK;
  vec2 uv=st;
  uv.x=1.-uv.x;
  float aspect=u_resolution.x/u_resolution.y;
  if(aspect>1.){
    uv.y*=aspect;
  }else{
    uv.x/=aspect;
  }
  vec2 pixel_size=PIXEL_SIZE/u_resolution;
  
  scene=mix(scene,RGB_GRAY_2,
    grid(uv+u_grid_offset,u_grid,pixel_size)
  );
  
  float i=floor((uv.x*u_grid.x))/u_grid.x;
  vec2 grid_uv=fract(uv*u_grid);
  vec4 data=texture2D(u_candles,vec2(i,0));
  float high=u_hl.r;
  float low=u_hl.g;
  float height=high-low;
  data-=low;
  data/=height;
  vec3 candle_color;
  if(data.r<=data.a){
    candle_color=RGB_GREEN;
  }else{
    candle_color=RGB_RED;
  }
  
  float hl_rect=stroke_hl(uv.y,data.g,data.b);
  float hl_candle=min(hl_rect,stroke(grid_uv.x,.5,pixel_size.x*u_grid.x));
  scene=mix(scene,candle_color,hl_candle);
  
  float oc_rect=stroke_hl(uv.y,data.r+pixel_size.y,data.a-pixel_size.y);
  float oc_candle=min(oc_rect,stroke(grid_uv.x,.5,.4));
  scene=mix(scene,candle_color,oc_candle);
  
  gl_FragColor=vec4(scene,1.);
}