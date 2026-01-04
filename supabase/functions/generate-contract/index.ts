import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { project, customer, teamMembers } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating contract for project:", project.title);

    const systemPrompt = `Sen profesyonel bir inşaat hukuku uzmanısın. Taşeron sözleşmeleri hazırlama konusunda uzmansın.
Verilen proje detaylarına göre kapsamlı ve yasal açıdan geçerli bir taşeron sözleşmesi taslağı hazırla.

Sözleşme şu bölümleri içermeli:
1. TARAFLAR - İşveren ve taşeron bilgileri
2. SÖZLEŞMENİN KONUSU - Yapılacak işin tanımı
3. SÖZLEŞME BEDELİ - Ücret ve ödeme koşulları
4. İŞ SÜRESİ - Başlangıç ve bitiş tarihleri
5. TARAFLARIN YÜKÜMLÜLÜKLERİ - Her iki tarafın sorumlulukları
6. İŞ GÜVENLİĞİ - İSG kuralları ve yükümlülükler
7. CEZAİ ŞARTLAR - Gecikme ve eksik iş durumları
8. FESİH KOŞULLARI - Sözleşmenin sona ermesi
9. UYUŞMAZLIKLARIN ÇÖZÜMÜ - Arabuluculuk ve mahkeme
10. DİĞER HÜKÜMLER - Genel hükümler

Sözleşmeyi Markdown formatında hazırla. Profesyonel ve resmi bir dil kullan.`;

    const userPrompt = `Aşağıdaki proje için taşeron sözleşmesi hazırla:

PROJE BİLGİLERİ:
- Proje Adı: ${project.title}
- Açıklama: ${project.description || 'Belirtilmemiş'}
- Başlangıç Tarihi: ${project.startDate}
- Bitiş Tarihi: ${project.endDate}
- Bütçe: ${project.budget ? `${project.budget.toLocaleString('tr-TR')} TL` : 'Belirtilmemiş'}
- Gerçekleşen Maliyet: ${project.actualCost ? `${project.actualCost.toLocaleString('tr-TR')} TL` : 'Henüz yok'}
- Gelir: ${project.revenue ? `${project.revenue.toLocaleString('tr-TR')} TL` : 'Belirtilmemiş'}
- Durum: ${project.status}
- İlerleme: %${project.progress}

MÜŞTERİ BİLGİLERİ:
${customer ? `
- Ad/Unvan: ${customer.name}
- Telefon: ${customer.phone || 'Belirtilmemiş'}
- Adres: ${customer.address || 'Belirtilmemiş'}
` : 'Müşteri bilgisi bulunmuyor'}

ATANAN EKİP ÜYELERİ:
${teamMembers && teamMembers.length > 0 
  ? teamMembers.map((m: any) => `- ${m.name} (${m.specialty}) - Günlük Ücret: ${m.daily_wage ? `${m.daily_wage.toLocaleString('tr-TR')} TL` : 'Belirtilmemiş'}`).join('\n')
  : 'Ekip üyesi atanmamış'}

Bu bilgilere göre detaylı ve profesyonel bir taşeron sözleşmesi taslağı oluştur.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Çok fazla istek gönderildi, lütfen biraz bekleyin." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Kredi yetersiz, lütfen hesabınıza kredi ekleyin." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const contract = data.choices?.[0]?.message?.content;

    if (!contract) {
      throw new Error("Sözleşme oluşturulamadı");
    }

    console.log("Contract generated successfully");

    return new Response(JSON.stringify({ contract }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating contract:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Bilinmeyen hata" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
