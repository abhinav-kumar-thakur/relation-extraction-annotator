from fileinput import filename
from itertools import count
import json
import json
import random

from flask import Blueprint, send_file

from configs.reader import read_json_configs

configs = read_json_configs('./configs/multi_modal_configs.json')

sorted_similarities_filepath = configs.sorted_similarities_filepath
extracted_data_directory = configs.extracted_data_directory
processed_data_directory = configs.processed_data_directory
detected_objects_directory = configs.detected_objects_directory
objects_info_filepath = configs.objects_info_filepath


predictions = {
    'bertweet': '/Users/vision/Downloads/bertweet_predictions.json',
    'clip': '/Users/vision/Downloads/clip_predictions.json',
    'combined_predictions': '/Users/vision/Downloads/combined_predictions.json'
}


objects_info = json.load(open(objects_info_filepath)) if objects_info_filepath else {}
sorted_similarities = json.load(open(sorted_similarities_filepath)) if sorted_similarities_filepath else {}
labels = json.load(open(processed_data_directory + "/labels.json")) if processed_data_directory else {}

loaded_predictions = {k: json.load(open(v)) for k, v in predictions.items()}

test_images = list(sorted_similarities.keys())

multi_modal_bp = Blueprint('multi_modal', __name__)

@multi_modal_bp.route('/image/data/extracted/<string:dir>/<string:image_path>', methods=['GET'])
def get_image(dir:str, image_path: str):
    return send_file(f'{extracted_data_directory}/{dir}/{image_path}')

@multi_modal_bp.route(f'/objects/{detected_objects_directory}/<string:image_path>', methods=['GET'])
def get_objects(image_path: str):
    return send_file(f'{detected_objects_directory}/{image_path}')

@multi_modal_bp.route('/info/random', methods=['GET'])
def get_info():
    test_image = random.choice(test_images)

    info_dict = {}
    info_dict['image'] = test_image
    info_dict['labels'] = '/'.join([k[:3] for k, v in labels[test_image].items() if v == '1'])

    for object in objects_info[test_image]:
        object['filename'] = object['filename'].replace("/content/drive/MyDrive/Processed/objects", detected_objects_directory)

    info_dict['objects'] = objects_info[test_image]

    prediction_info = {}
    for k, v in loaded_predictions.items():
        print(test_image)
        prediction_info[k] = v['./' + test_image]
    
    similarities = []
    sorted_similar_images = list(sorted(sorted_similarities[test_image].items(), key=lambda item: item[1], reverse=True))
    for image, similarity in sorted_similar_images[:5]:
        for object in objects_info[image]:
            object['filename'] = object['filename'].replace("/content/drive/MyDrive/Processed/objects", detected_objects_directory)

        similarities.append({
            'image': image, 
            'similarity': similarity, 
            'labels': '/'.join([k[:3] for k, v in labels[image].items() if v == '1']),
            'objects': objects_info[image]
            })

    k = 20
    info_dict['misogynous'] = sum([1 for i, s in  sorted_similar_images[:k] if labels[i]['misogynous'] == '1']) / k
    info_dict['shaming'] = sum([1 for i, s in  sorted_similar_images[:k] if labels[i]['shaming'] == '1']) / k
    info_dict['stereotype'] = sum([1 for i, s in  sorted_similar_images[:k] if labels[i]['stereotype'] == '1']) / k
    info_dict['objectification'] = sum([1 for i, s in  sorted_similar_images[:k] if labels[i]['objectification'] == '1']) / k
    info_dict['violence'] = sum([1 for i, s in  sorted_similar_images[:k] if labels[i]['violence'] == '1']) / k
    info_dict['predictions'] = prediction_info
    
    info_dict['similarities'] = similarities
    return info_dict