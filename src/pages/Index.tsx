import { ProductViewer } from "@/components/ProductViewer";

const Index = () => {
  return (
    <main className="w-full h-screen overflow-hidden bg-background">
      <ProductViewer 
        title="Advanced 3D Product Viewer"
        description="Professional-grade 3D visualization with PBR materials and real-time rendering"
      />
    </main>
  );
};

export default Index;
