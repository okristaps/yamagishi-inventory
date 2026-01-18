'use client';
import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
  IonButton,
  IonIcon,
  IonBadge,
} from '@ionic/react';
import { add, cube } from 'ionicons/icons';
import { Product } from '../../src/database/entities';
import { databaseService } from '../../src/database/database.config';
import { DatabaseInitService } from '../../src/database/services/DatabaseInitService';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAndLoadProducts();
  }, []);

  const initializeAndLoadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize database
      await DatabaseInitService.initialize();
      
      // Load products
      await loadProducts();
    } catch (err) {
      console.error('Failed to initialize app:', err);
      setError(err instanceof Error ? err.message : 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const dataSource = databaseService.getDataSource();
      if (!dataSource) {
        throw new Error('Database not initialized');
      }

      const productRepo = dataSource.getRepository(Product);
      const allProducts = await productRepo.find({
        where: { isActive: true },
        order: { name: 'ASC' }
      });

      setProducts(allProducts);
    } catch (err) {
      console.error('Failed to load products:', err);
      throw err;
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.quantity <= 0) {
      return { label: 'Out of Stock', color: 'danger' };
    } else if (product.quantity <= product.minimumStock) {
      return { label: 'Low Stock', color: 'warning' };
    }
    return { label: 'In Stock', color: 'success' };
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Inventory</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <IonSpinner name="crescent" />
              <p className="mt-4">Loading inventory...</p>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (error) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Inventory</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonCard color="danger">
            <IonCardContent>
              <h3>Error Loading Inventory</h3>
              <p>{error}</p>
              <IonButton 
                expand="block" 
                fill="outline" 
                onClick={initializeAndLoadProducts}
                className="mt-4"
              >
                Retry
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <div className="flex items-center">
              <IonIcon icon={cube} className="mr-2" />
              Inventory ({products.length})
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="p-4">
          <IonButton 
            expand="block" 
            className="mb-4"
            color="primary"
          >
            <IonIcon icon={add} slot="start" />
            Add Product
          </IonButton>

          {products.length === 0 ? (
            <IonCard>
              <IonCardContent className="text-center py-8">
                <IonIcon icon={cube} size="large" color="medium" />
                <h3 className="mt-4 mb-2">No Products Found</h3>
                <p className="text-gray-500">Add your first product to get started</p>
              </IonCardContent>
            </IonCard>
          ) : (
            <IonList>
              {products.map((product) => {
                const stockStatus = getStockStatus(product);
                return (
                  <IonCard key={product.id} className="mb-4">
                    <IonCardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <IonCardTitle className="text-lg">{product.name}</IonCardTitle>
                          {product.description && (
                            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                          )}
                        </div>
                        <IonBadge color={stockStatus.color as any}>
                          {stockStatus.label}
                        </IonBadge>
                      </div>
                    </IonCardHeader>
                    <IonCardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>SKU:</strong> {product.sku || 'N/A'}
                        </div>
                        <div>
                          <strong>Quantity:</strong> {product.quantity}
                        </div>
                        <div>
                          <strong>Price:</strong> ${product.price.toFixed(2)}
                        </div>
                        <div>
                          <strong>Location:</strong> {product.location || 'N/A'}
                        </div>
                      </div>
                      {product.category && (
                        <IonBadge color="light" className="mt-2">
                          {product.category}
                        </IonBadge>
                      )}
                    </IonCardContent>
                  </IonCard>
                );
              })}
            </IonList>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Inventory;