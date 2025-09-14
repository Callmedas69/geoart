import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";
import { getCollectionBySlug } from "../../../../services/collections";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const collection = await getCollectionBySlug(slug);

    if (!collection) {
      return new Response("Collection not found", { status: 404 });
    }

    // Load League Spartan font from local TTF file
    const leagueSpartan = fs.readFileSync(
      path.join(process.cwd(), "public/fonts/league-spartan_bold.ttf")
    );

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "1200px",
            height: "630px",
            backgroundColor: "#f00f19",
            padding: "60px",
          }}
        >
          {/* Left Column - Featured Image */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "300px",
              height: "500px",
              marginRight: "60px",
              transform: "rotate(-7deg)",
            }}
          >
            {collection.packImage ? (
              <img
                src={collection.packImage}
                alt={collection.name}
                style={{
                  width: "300px",
                  height: "500px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "8px 8px 16px rgba(0, 0, 0, 0.3)",
                }}
              />
            ) : (
              <div
                style={{
                  width: "300px",
                  height: "500px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "64px",
                  fontWeight: "700",
                  color: "#ffffff",
                  fontFamily: "League Spartan",
                  boxShadow: "8px 8px 16px rgba(0, 0, 0, 0.3)",
                }}
              >
                {collection.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* Right Column - Collection Info */}
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Collection Name & Description */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: "800",
                  color: "#ffffff",
                  margin: 0,
                  marginBottom: "20px",
                  lineHeight: 1.1,
                  fontFamily: "League Spartan",
                }}
              >
                {collection.name}
              </h1>

              <p
                style={{
                  fontSize: "22px",
                  color: "#ffffff",
                  margin: 0,
                  lineHeight: 1.4,
                  maxHeight: "350px",
                  overflow: "hidden",
                  fontFamily: "League Spartan",
                }}
              >
                {collection.description}
              </p>
              <p
                style={{
                  fontSize: "22px",
                  color: "#ffffff",
                  margin: 0,
                  lineHeight: 1.4,
                  overflow: "hidden",
                }}
              >
                Open your booster packs on Vibemarket
              </p>
            </div>

            {/* GeoPack Manager Branding - Bottom Right */}
            <div
              style={{
                alignSelf: "flex-end",
                fontSize: "20px",
                color: "#ffffff",
                fontWeight: "700",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                fontFamily: "League Spartan",
              }}
            >
              PACKED WITH GEOPACK MANAGER
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "League Spartan",
            data: leagueSpartan,
            style: "normal",
            weight: 700,
          },
        ],
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Error generating image", { status: 500 });
  }
}
