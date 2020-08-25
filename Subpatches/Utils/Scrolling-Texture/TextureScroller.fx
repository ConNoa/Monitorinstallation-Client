Texture2D tex0 <string uiname="Texture";>;

SamplerState s0 <bool visible=false;string uiname="Sampler";>
{Filter=MIN_MAG_MIP_LINEAR;AddressU=CLAMP;AddressV=CLAMP;};


float4x4 tVP:VIEWPROJECTION;
float4x4 tW:WORLD;
float4x4 tWVP: WORLDVIEWPROJECTION;
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

float Scroll <float uimin=0.0; float uimax=1.0;> = 1; 
float Aspect=1;
float2 R:TARGETSIZE;

float3 GetScaleVector(float4x4 w){
	float3 p0=mul(float3(1,0,0),(float3x3)w);
	float3 p1=mul(float3(0,1,0),(float3x3)w);
	float3 p2=mul(float3(0,0,1),(float3x3)w);
	float3 sc=float3(length(p0),length(p1),length(p2));
	return sc;
}

VS_OUT VS(VS_IN In){
	VS_OUT Out=(VS_OUT)0;
	float4 PosW=In.PosO;
	PosW=mul(PosW,tW);
	Out.PosWVP=mul(PosW,tVP);
	Out.TexCd=mul(In.TexCd,tTex);
	float2 sz;tex0.GetDimensions(sz.x,sz.y);
	float3 sw=GetScaleVector(tW);
	Out.TexCd.zw=Out.TexCd.xy;
	float asp=Aspect;
	asp*=R.y/R.x;
	asp*=sw.y/sw.x;
	Out.TexCd.w*=sz.x/sz.y*asp;
	Out.TexCd.w+=Scroll*(1-sz.x/sz.y*asp);
	return Out;
}


float4 PS(VS_OUT In):SV_Target{
	float2 uv=In.TexCd.zw;
	
	float4 c=tex0.Sample(s0,uv);
	c=c*Color;
	c.a*=Alpha;
	return c;
}
float4 PSpix(VS_OUT In):SV_Target{
	//float2 uv=In.TexCd.zw;
	float2 vp=In.PosWVP.xy;
	float2 sz;tex0.GetDimensions(sz.x,sz.y);
	float3 sw=GetScaleVector(tW);
	float4 pp=mul(float4(-0.5,-0.5,0,1),tWVP);
	float2 origin=pp.xy*float2(1,1)*0.5+0.5;
	float2 uv=(floor(vp.xy+float2(0,Scroll*(sz.y-R.y*sw.y*0.5))-origin*R)+0.5)/sz;
	
	
	float4 c=tex0.Sample(s0,uv);
	c=c*Color;
	c.a*=Alpha;
	return c;
}

technique10 Normalized{
	pass P0{
		SetVertexShader(CompileShader(vs_5_0,VS()));
		SetPixelShader(CompileShader(ps_5_0,PS()));
	}
}
technique10 PixelAligned{
	pass P0{
		SetVertexShader(CompileShader(vs_5_0,VS()));
		SetPixelShader(CompileShader(ps_5_0,PSpix()));
	}
}



