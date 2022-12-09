from fileinput import filename
import json
import json
import random

from flask import Blueprint, send_file
from collections import defaultdict

from configs.reader import read_json_configs

configs = read_json_configs('./configs/multi_modal.json')

sorted_similarities_filepath = configs.sorted_similarities_filepath
extracted_data_directory = configs.extracted_data_directory
processed_data_directory = configs.processed_data_directory
detected_objects_directory = configs.detected_objects_directory
objects_info_filepath = configs.objects_info_filepath

sorted_similarities_filepath = {
    'combined': '/data/processed/combined_sorted_similarities.json',
    'clip': '/data/processed/clip_sorted_similarities.json',
    'bertweet': '/data/processed/bertweet_sorted_similarities.json',
    'bert': '/data/processed/bert-base-uncased_sorted_similarities.json',
}

prediction_folds = {
    'clip': 4,
    'combined': 4,
    'bertweet': 3,
    'bert': 4,
}

sorted_similarities = defaultdict(lambda: [])
for key in sorted_similarities_filepath:
    sorted_similarities[key] = json.load(open(sorted_similarities_filepath[key]))


predictions = {
    'combined': '/logs/combined-B/predictions.log',
    'clip': '/logs/clip-B/predictions.log',
    'bertweet': '/logs/bertweet-B/predictions.log',
    'bert': '/logs/bert-base-uncased-B/predictions.log', 
    # 'A-b': '/logs/bert-base-uncased-A/predictions.log',
    # 'B-b': '/logs/bert-base-uncased-B/predictions.log',
    # 'A-bl': '/logs/bert-large-uncased-A/predictions.log',
    # 'B-bl': '/logs/bert-large-uncased-B/predictions.log',
    # 'A-bt': '/logs/bertweet-A/predictions.log',
    # 'B-bt': '/logs/bertweet-B/predictions.log',
    # 'A-cl': '/logs/clip-A/predictions.log',
    # 'B-cl': '/logs/clip-B/predictions.log',
    # 'A-co': '/logs/combined-A/predictions.log',
    # 'B-co': '/logs/combined-B/predictions.log'
}

objects_info = json.load(open(objects_info_filepath)) if objects_info_filepath else {}
labels = json.load(open(processed_data_directory + "/labels.json")) if processed_data_directory else {}


loaded_predictions = {}
for model_type, prediction_file in predictions.items():
    with open(prediction_file) as f:
        for i, line in enumerate(f):
            if i == prediction_folds[model_type]:
                line = line.strip()
                loaded_predictions[model_type] = json.loads(line)


test_images = list(list(sorted_similarities.values())[0].keys())
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

    for object in objects_info[f'./{test_image}']:
        object['filename'] = object['filename'].replace("./content/drive/MyDrive/Processed/objects", detected_objects_directory)

    info_dict['objects'] = objects_info[f'./{test_image}']

    prediction_info = {}
    for k, v in loaded_predictions.items():
        print(test_image)
        prediction_info[k] = v['./' + test_image]
    
    similarities = defaultdict(list)
    for key in sorted_similarities:
        sorted_similar_images = list(sorted(sorted_similarities[key][test_image].items(), key=lambda item: item[1], reverse=True))
        for image, similarity in sorted_similar_images[:3]:
            for object in objects_info['./' + image]:
                object['filename'] = object['filename'].replace("/content/drive/MyDrive/Processed/objects", detected_objects_directory)

            similarities[key].append({
                'image': image, 
                'similarity': similarity, 
                'labels': '/'.join([k[:3] for k, v in labels[image].items() if v == '1']),
                'objects': objects_info['./' + image]
                })

    # k = 20
    # info_dict['misogynous'] = sum([1 for i, s in  sorted_similar_images[:k] if labels[i]['misogynous'] == '1']) / k
    # info_dict['shaming'] = sum([1 for i, s in  sorted_similar_images[:k] if labels[i]['shaming'] == '1']) / k
    # info_dict['stereotype'] = sum([1 for i, s in  sorted_similar_images[:k] if labels[i]['stereotype'] == '1']) / k
    # info_dict['objectification'] = sum([1 for i, s in  sorted_similar_images[:k] if labels[i]['objectification'] == '1']) / k
    # info_dict['violence'] = sum([1 for i, s in  sorted_similar_images[:k] if labels[i]['violence'] == '1']) / k
    info_dict['predictions'] = prediction_info
    info_dict['similarities'] = similarities
    return info_dict