Texture2D tex0 <string uiname="Texture";>;

SamplerState s0 <bool visible=false;string uiname="Sampler";>
{Filter=MIN_MAG_MIP_LINEAR;AddressU=WRAP;AddressV=WRAP;};

float4x4 tWVP:WORLDVIEWPROJECTION;
float4x4 tVP:VIEWPROJECTION;
float4x4 tW:WORLD;
float4x4 tV:VIEW;
float4x4 tP:PROJECTION;
float4x4 tWI:WORLDINVERSE;
float4x4 tVI:VIEWINVERSE;
float4x4 tPI:PROJECTIONINVERSE;
float4x4 tWIT:WORLDINVERSETRANSPOSE;

float Alpha <float uimin=0.0; float uimax=1.0;> = 1; 
float4 Color <bool color=true;> = {1.0,1.0,1.0,1.0};
float4x4 tTex <string uiname="Texture Transform";>;

struct VS_IN{
	float4 PosO:POSITION;
	float4 TexCd:TEXCOORD0;
};

struct VS_OUT{
	float4 PosWVP:SV_POSITION;
	float4 TexCd:TEXCOORD0;
};

VS_OUT VS(VS_IN In){
	VS_OUT Out=(VS_OUT)0;
	float4 PosW=In.PosO;
	PosW=mul(PosW,tW);
	Out.PosWVP=mul(PosW,tVP);
	Out.TexCd=mul(In.TexCd,tTex);
	return Out;
}
float lfade(float g,float f,float s=1){return (g-1)*s+(f*(s+1));}
float4 BlickColor <bool color=true;> = {1.0,1.0,1.0,1.0};
float4x4 tBlick <string uiname="Blick Transform";>;
float BlickSize <float uimin=0.0; float uimax=1.0;> =0.25; 

float BlickPhase <float uimin=0.0; float uimax=1.0;> =0;

float4 PS(VS_OUT In):SV_Target{
	float4 c=tex0.Sample(s0,In.TexCd.xy);
	c=c*Color;
	float2 uv=In.TexCd.xy;
	uv=mul(float4((uv.xy*2-1)*float2(1,-1),0,1),tBlick).xy*float2(1,-1)*.5+.5;

	float f=lfade(uv.x,BlickPhase,0.5/BlickSize);
	c.rgb=lerp(c.rgb,BlickColor.rgb,pow(saturate(1-pow(saturate(2*abs(f-.5)),.5)),2)*BlickColor.a*pow(smoothstep(.5,0,abs(BlickPhase-.5)),.3));
	
	c.a*=Alpha;
	return c;
}


technique10 Constant{
	pass P0{
		SetVertexShader(CompileShader(vs_5_0,VS()));
		SetPixelShader(CompileShader(ps_5_0,PS()));
	}
}




