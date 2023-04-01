#define RGB_DARK vec3(.1)
#define RGB_GRAY_2 vec3(.2)
#define PIXEL_SIZE 1.

varying vec2 st;
uniform vec2 u_resolution;
uniform vec2 u_grid;

float fill(float v,float th){
  return step(v,th);
}

float stroke(float v,float c,float w){
  return fill(v,c+w/2.)-fill(v,c-w/2.);
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
  float grid_scale=max(1.,aspect);
  
  scene=mix(scene,RGB_GRAY_2,
    grid(uv,u_grid,pixel_size)
  );
  
  gl_FragColor=vec4(scene,1.);
}