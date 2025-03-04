import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suprime logs do TensorFlow
import sys
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras import layers, Model
from tensorflow.keras.preprocessing import image
import numpy as np
import json



model_path = './best_classificador_ulcera.weights.h5'
threshold = 0.3  # Limiar ajustado para 0.3


# Carregar o modelo
def load_model():
    img_height, img_width = 128, 128  # Dimensões usadas no treinamento
    base_model = MobileNetV2(weights=None, include_top=False, input_shape=(img_height, img_width, 3))
    base_model.trainable = False

    inputs = layers.Input(shape=(img_height, img_width, 3))
    x = base_model(inputs, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dense(512, activation='relu')(x)
    x = layers.Dropout(0.5)(x)
    outputs = layers.Dense(1, activation='sigmoid')(x)
    model = Model(inputs, outputs)

    model.load_weights(model_path)  # Carregar os pesos salvos
    return model

model = load_model()

# Função para pré-processar a imagem
def preprocess_image(image_path):
    img = image.load_img(image_path, target_size=(128, 128))  # Redimensiona a imagem
    img_array = image.img_to_array(img) / 255.0  # Normalização
    return np.expand_dims(img_array, axis=0)  # Adiciona a dimensão do batch

# Função de predição
def predict(image_path, threshold=threshold):
    img = preprocess_image(image_path)
    prediction = model.predict(img, verbose=0)
    result = "Com úlcera" if prediction[0] < threshold else "Sem úlcera"
    return result

# Ponto de entrada do script
if __name__ == "__main__":
    image_path = sys.argv[1]  # Recebe o caminho da imagem como argumento
    
    if (image_path):
        try:
            result = predict(image_path)
            print(json.dumps({"prediction": result}, ensure_ascii=False))  # JSON válido
        except Exception as e:
            print(json.dumps({"error": str(e)}, ensure_ascii=False))  # Retorna o erro como JSON